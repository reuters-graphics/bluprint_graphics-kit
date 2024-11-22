<script lang="ts">
  import { assets } from '$app/paths';
  import {
    Article,
    Theme,
    PymChild,
    Block,
  } from '@reuters-graphics/graphics-components';

  import archieML from '$locales/en/content.json';
  import { homepage } from '$pkg';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  $: content = archieML.story;
</script>

<Theme>
  <Article>
    <Block width="fluid">
      <div class="embed-container">
        <a href="{homepage}" target="_parent">
          <div class="referral-container">
            <div class="image-cell">
              <img
                src="{assets}/{content.shareImgPath}"
                alt="Ukraine counteroffensive map"
              />
            </div>
            <div class="title-cell">
              <p class="overtitle">More from Reuters</p>
              <p class="headline text-primary text-2xl leading-none">
                {content.shareTitle}
              </p>
            </div>
          </div>
        </a>
      </div>
    </Block>
  </Article>
</Theme>

<PymChild polling="{500}" />

<style lang="scss">
  div.embed-container {
    max-width: 800px;
    padding: 1rem 0;
    @media (max-width: 450px) {
      padding: 2rem 0;
    }
  }
  a {
    text-decoration: none !important;
  }
  div.referral-container {
    &:hover {
      img {
        filter: brightness(95%);
      }
      .title-cell {
        p.headline {
          text-decoration: underline;
        }
      }
    }
    padding: 0;
    display: flex;
    gap: 20px;
    @media (max-width: 600px) {
      gap: 10px;
    }
    @media (max-width: 450px) {
      flex-direction: column-reverse;
    }
    align-items: center;
    max-width: 800px;
    margin: 0;
    .image-cell {
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #ddd;
      width: 40%;
      height: 0;
      padding-top: 17%;
      position: relative;
      overflow: hidden;
      @media (max-width: 450px) {
        width: 100%;
        padding-top: 45%;
      }
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
        margin: 0;
      }
    }
    .title-cell {
      max-width: 65%;
      @media (max-width: 450px) {
        width: 100%;
        max-width: 100%;
      }
      p {
        font-family: var(--theme-font-family-hed);
      }
      p.overtitle {
        color: rgb(224, 90, 57);
        font-weight: 600;
        font-size: 0.85rem;
        line-height: 0.85rem;
        margin: 0 0 2px;
      }
      p.headline {
        margin: 0;
        font-weight: 800;
        text-decoration: none !important;
        margin: 0;
        color: #333;
      }
    }
  }
</style>
