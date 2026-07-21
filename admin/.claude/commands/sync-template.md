Sync this client project with the latest template changes.

1. Run `git fetch template` to pull the latest commits from the template remote.

2. Run `git log template/main --oneline` and compare against the current branch's log to find commits that exist in `template/main` but not in the current branch. Show the user the list of new commits with their SHAs and messages.

3. Ask the user: "Which commits do you want to cherry-pick? (enter SHAs separated by spaces, or 'all' to pick all of them)" — wait for their response.

4. Cherry-pick the selected commits in order (oldest first). If a conflict occurs, stop and show the user exactly which files are conflicting and what to do.

5. Run `git push` to push the changes.

6. Show a summary of what was synced.
