# Zendo website workspace boundary

This directory is a website/backend development copy of `ZendoDeployL1` at the
W1 separation point. It intentionally excludes Android source, APK output,
temporary files, and build caches. The public website and its API remain the
only runtime scope here.

The Android investor build is maintained separately in `../Zendo-APK`. An APK
build may consume an explicitly generated frontend snapshot, but this website
workspace must never be edited through Android build output or a packaged APK.
No Render deployment or source push is performed by this separation step.
