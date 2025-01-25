#!/bin/bash

# Check if a commit hash was provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <commit-hash>"
  exit 1
fi

# Assign the provided commit hash to a variable
COMMIT_HASH="$1"

# Get all branches except 'main'
BRANCHES=$(git branch | grep -v "main" | sed 's/^\* //')

# Loop through each branch
for BRANCH in $BRANCHES; do
  echo "Processing branch: $BRANCH"

  # Checkout the branch
  git checkout "$BRANCH"

  # Cherry-pick the commit
  git cherry-pick "$COMMIT_HASH"
  if [ $? -ne 0 ]; then
    echo "Cherry-pick failed on branch $BRANCH. Resolve conflicts and continue manually."
    exit 1
  fi

  # Push the changes
  git push origin "$BRANCH"

  # Output the status
  echo "Successfully cherry-picked and pushed commit $COMMIT_HASH to $BRANCH"
done

# Checkout the main branch at the end
git checkout main
echo "Switched back to the main branch."