![Steam BBCodes logo](https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/Logo128.png)
# Steam BBCodes

Userscript that injects a simple BBCodes editor into Steam site's interface. Depends on some of Steam's scripts.

Runs on:
- include
```
/^https?:\/\/steamcommunity.com\/(id|profiles|sharedfiles|groups|discussions)\/(?!editguidesubsection\/).*/
```
- match
```
*://store.steampowered.com/app/*
```

Supports:

- Activity

    - commenting
    - status
    - purchase

- Screenshots, artwork, workshop

    - new artwork
    - editing
    - commenting

- Group

    - commenting
    - announcements
    - curator doesn't support tags
    - events don't support tags

- Announcements

    - new announcement
    - editing
    - commenting
    - games

- Forum

    - new topic
    - editing topic (first post)
    - editing post
    - deleting post
    - undoing deleted post
    - moving to another page

- Guides

    - commenting
    - editing excluded - has own interface
    - writing excluded - has own interface

- News
- Profiles
- Reviews

    - writing
    - editing
    - commenting