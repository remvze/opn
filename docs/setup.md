## Setup Your OPN Profile

Setting up your OPN profile is quick and account-free. Just follow these steps:

### 1. Create a `.opn` Repository

Create a public repository in your GitHub account with the name:

```
.opn
```

> Note: The name must be exactly `.opn`, including the leading dot.

### 2. Add a `bio.json` File

Inside the `.opn` repository, create a file named:

```
bio.json
```

This file contains all the data shown on your OPN profile.

### 3. Fill in Your Bio Data

Here is a basic example of what your `bio.json` might look like:

```json
{
  "version": 1,
  "name": "Your Name",
  "description": "A short description",
  "sections": [
    {
      "title": "Socials",
      "type": "links",
      "links": [
        {
          "title": "Website",
          "url": "https://example.com"
        },
        {
          "title": "GitHub",
          "url": "https://github.com/example"
        }
      ]
    },
    {
      "title": "Stack",
      "type": "stack",
      "stack": ["Astro", "TypeScript", "React"]
    }
  ]
}
```

> You can customize this with more fields and sections. See the [full schema](/schema.md) for details.

### You're Live

Once your `.opn` repo and `bio.json` file are public, your OPN profile is live at:

```
https://opn.bio/@your-github-username
```

To update your profile, simply edit your `bio.json` file.

> Note: GitHub may cache your `bio.json` file, so changes might take a few minutes to appear on your OPN profile.
