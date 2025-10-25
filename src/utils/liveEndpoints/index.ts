interface ConfigLiveEndpoint {
  enabled: boolean;
  json: string;
  aml: string;
}

interface StoryConfig {
  name: string;
  rngsIo: string;
  syncPath: string;
  preview?: ConfigLiveEndpoint;
  public?: ConfigLiveEndpoint;
}

interface StoryboardConfig {
  name: string;
  rngsIo: string;
  stories: {
    [storyId: string]: StoryConfig;
  };
}

interface StoryClientConfig {
  storyboards: {
    [storyboardId: string]: StoryboardConfig;
  };
}

type LiveEndpoint = {
  localFile: string;
  metadata: {
    id: string;
    name: string;
    storyboard: {
      id: string;
      name: string;
    };
    lastPublished: string;
    version: 'preview' | 'public';
  };
  story: unknown;
};

/**
 * LiveEndpoints connects your app to updating data published independent of your project files.
 *
 * This is often used in preview stages, but can also be used in production to allow updating a
 * published page with new content.
 */
export class LiveEndpoints {
  private clientConfig: StoryClientConfig;
  private currentUrl: URL;
  /**
   * @param clientConfig RNGS.io config object, usually imported directly from `rngs-io.json`
   * in the root of the project.
   * @param currentUrl URL of the current page.
   */
  constructor(clientConfig: StoryClientConfig, currentUrl: URL) {
    this.clientConfig = clientConfig;
    this.currentUrl = currentUrl;
  }

  private extractLiveUrlsFromConfig(config: StoryClientConfig) {
    const urls: {
      url: string;
      localFile: string;
      version: 'preview' | 'public';
    }[] = [];

    // Loop through each storyboard in the storyboards object
    for (const storyboardId in config.storyboards) {
      const storyboard = config.storyboards[storyboardId];

      // Loop through each story in the stories object of the current storyboard
      for (const storyId in storyboard.stories) {
        const story = storyboard.stories[storyId];

        // Check both 'preview' and 'public' keys in the story
        (['preview', 'public'] as const).forEach((version) => {
          const media = story[version];
          // If media exists, is not an empty object, and enabled is true
          if (media && Object.keys(media).length !== 0 && media.enabled) {
            // If the json URL exists, add it to the urls array
            if (media.json) {
              urls.push({
                localFile: story.syncPath,
                url: media.json,
                version,
              });
            }
          }
        });
      }
    }

    return urls;
  }

  private async fetchLiveUrls(urlsData: { url: string; localFile: string }[]) {
    const fetchPromises = urlsData.map(
      async (data: {
        url: string;
        localFile: string;
      }): Promise<LiveEndpoint> => {
        const response = await fetch(data.url);
        const story = (await response.json()) as LiveEndpoint;
        return { ...story, localFile: data.localFile };
      }
    );

    const result = await Promise.all(fetchPromises);
    return result;
  }

  private async fetchLiveEndPoints() {
    const liveUrls = this.extractLiveUrlsFromConfig(this.clientConfig);

    let liveStories: LiveEndpoint[] = [];

    // Public pages
    if (this.currentUrl.hostname === 'reuters.com') {
      const versionLiveUrls = liveUrls.filter(
        ({ version }) => version === 'public'
      );
      liveStories = await this.fetchLiveUrls(versionLiveUrls);
    }

    // Preview pages
    if (this.currentUrl.hostname === 'graphics.thomsonreuters.com') {
      const versionLiveUrls = liveUrls.filter(
        ({ version }) => version === 'preview'
      );
      liveStories = await this.fetchLiveUrls(versionLiveUrls);
    }

    return liveStories;
  }

  /**
   * Get the latest version of content docs, which may be published remotely.
   *
   * @example
   * ```typescript
   * import localContent from '$locales/en/content.json';
   *
   * const liveEndpoints = new LiveEndpoints(rngsIoConfig, url);
   * const content = await liveEndpoints.getLiveContent('en/content', localContent);
   * ```
   * @param localeFilePath Path part of the locale file, e.g., `en/content` for
   * `locales/en/content.json`
   * @param localContent Local copy of the locale file, imported directly as json.
   * @returns The latest content
   */
  async getLiveContent<T>(localeFilePath: string, localContent: T): Promise<T> {
    const liveEndpoints = await this.fetchLiveEndPoints();
    const pathParts = localeFilePath.split('/');
    if (pathParts.length !== 2) {
      throw new Error(
        'Invalid locale file. Must have just two path parts, e.g., "en/content"'
      );
    }

    const liveContent = liveEndpoints.find(
      (endPoint) => endPoint.localFile === `locales/${localeFilePath}.json`
    );

    // If no live content found, return local content
    if (!liveContent) {
      return localContent;
    }

    // Compare lastPublished dates to determine which content is more recent
    const localContentWithMetadata = localContent as {
      metadata?: { lastSynced?: string };
    };

    const liveLastPublished = liveContent.metadata?.lastPublished;
    const localLastSynced = localContentWithMetadata.metadata?.lastSynced;

    // If local content doesn't have lastSynced return live content
    if (!localLastSynced) {
      return liveContent as typeof localContent;
    }

    // If live content doesn't have lastPublished, return local content
    if (!liveLastPublished) {
      return localContent;
    }

    // Compare dates - return live content if it's more recent, otherwise return local
    const liveDate = new Date(liveLastPublished);
    const localDate = new Date(localLastSynced);

    if (liveDate > localDate) return liveContent as typeof localContent;
    return localContent;
  }
}
