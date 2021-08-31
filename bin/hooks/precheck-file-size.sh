#!/bin/bash

# This is a pre-commit hook that ensures attempts to commit files that are
# larger than $limit to your _local_ repo fail, with a helpful error message.

# Maximum file size limit in bytes
limit=$(( 100 * 2**20 )) # 100MB
limitInMB=$(( $limit / 2**20 ))

# Highlights
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

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

echo "Checking file sizes before commit..."
shouldFail=false
# `--diff-filter=d` -> skip deletions
for file in $( git diff-index --cached --diff-filter=d --name-only "$against" ); do
	# Skip for directories (git submodules)
	if [[ -f "$file" ]]; then
		file_size=$( ls -lan $file | awk '{ print $5 }' )
		if [ "$file_size" -gt  "$limit" ]; then
				echo ""
	    	echo "📁 File ${CYAN}$file${NC} is $(( $file_size / 2**20 )) MB, which is larger than the $limitInMB MB limit"
				echo ""
				echo "  To fix:"
				echo "  1) Add \"$file\" to your ${CYAN}.gitgnore${NC}"
				echo "  2) Run: ${GREEN}git reset \"$file${NC}\""
				echo "  3) Try your commit again"
				echo ""
        	shouldFail=true
		fi
	fi
done

if $shouldFail
then
		echo "❌ Commit aborted."
    echo "Found files too big for GitHub! Please fix the files above before trying to commit again."
		echo ""
    exit 1;
fi