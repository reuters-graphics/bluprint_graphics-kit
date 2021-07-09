#!/bin/bash

# This is a pre-commit hook that ensures attempts to commit files that are
# larger than $limit to your _local_ repo fail, with a helpful error message.

# Maximum file size limit in bytes
limit=$(( 0.000000001 * 2**20 )) # 100MB
limitInMB=$(( $limit / 2**20 ))

# Move to the repo root so git files paths make sense
repo_root=$( git rev-parse --show-toplevel )
cd $repo_root

empty_tree=$( git hash-object -t tree /dev/null )

if git rev-parse --verify HEAD > /dev/null 2>&1
then
	against=HEAD
else
	against="$empty_tree"
fi

# Set split so that for loop below can handle spaces in file names by splitting on line breaks
IFS='
'

echo "Checking staged file sizes"
shouldFail=false
# `--diff-filter=d` -> skip deletions
for file in $( git diff-index --cached --diff-filter=d --name-only "$against" ); do
	# Skip for directories (git submodules)
	if [[ -f "$file" ]]; then
		file_size=$( ls -lan $file | awk '{ print $5 }' )
		if [ "$file_size" -gt  "$limit" ]; then
	    	echo File $file is $(( $file_size / 2**20 )) MB, which is larger than our configured limit of $limitInMB MB
        	shouldFail=true
		fi
	fi
done

if $shouldFail
then
    echo "A file was too big for GitHub. Please add it to your .gitignore."
	  echo Commit aborted
    exit 1;
fi