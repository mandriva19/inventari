#!/bin/bash
echo "Reverting the WhatsApp rich preview and SEO meta tags feature..."
git revert HEAD --no-edit
echo "Pushing the rollback to live..."
git push
echo "Done! The feature has been completely reverted."
