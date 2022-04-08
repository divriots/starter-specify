# Starter Specify

This starter-kit is for users that want to use [Specify](https://specifyapp.com) and
Design Tokens in [Figma](https://www.figma.com/) as a starting point to build their Design System.

If you are starting with [Backlight](https://backlight.dev), check the links below:

- [Explore starter-kits](https://backlight.dev/starterkits)
- [Backlight documentation](https://backlight.dev/docs)
- [Join chat](https://discord.gg/XkQxSU9)

## Full Video

Below, Joren shows how he created this starter-kit by walking you through connecting
Specify, Backlight and GitHub to your Figma Design system.

![Coming Soon]()

Alternatively, follow the steps below to set up Specify with your Backlight project.

## Figma Styles and Library

As a first step, create a Figma File and start with some Design Tokens in the form of Color, Effect, Text Styles.

![Figma Styles Screenshot](https://i.imgur.com/gHxVxqo.png)

Once done, publish this as a Figma Library.

![Figma Library Screenshot](https://i.imgur.com/TnDo7HI.png)

## Specify

Now that we have a published Figma library, let's connect that to Specify.
Open up your Specify Repository and add a Source --> Figma.

![Specify Sources Screenshot](https://i.imgur.com/cMv7sAQ.png)

Select your Design Token type, use "Local Styles" and in the link field, paste the link that you can copy from here:

![Figma Link Copy](https://i.imgur.com/HATw3FB.png)

You should now have your published styles as tokens in Specify.

## GitHub

To connect Specify with GitHub, it's important that your backlight project is connected to GitHub.
It's highly recommended to also install the Backlight GitHub App to make things more seamless.

Once done, go to Specify -> Destinations and install the Specify GitHub App to your repository.

After you've done this, you should add a `.specifyrc.json` file to the root of your repository, you can do so in GitHub directly, or through Backlight.
Here's an example `.specifyrc.json`:

```json
{
  "repository": "@divriots/starter-specify",
  "head": "specify",
  "rules": [
    {
      "name": "Design Tokens / Colors",
      "path": "sd-input/",
      "parsers": [
        {
          "name": "to-style-dictionary",
          "options": {
            "splitBy": "/"
          }
        }
      ]
    }
  ]
}
```

For repository field, make sure you use your **Specify Repository**, not your GitHub Repository.
In path, put a folder where you want your style-dictionary input JSON files to be inside of, we picked "sd-input" for the example.

For more information, see [Specify Configuration](https://specifyapp.com/developers/configuration).
For more docs on the parser, see [to-style-dictionary Parser](https://github.com/Specifyapp/parsers/tree/master/parsers/to-style-dictionary).

Once you have committed and pushed this file to your default branch, you should see a new Pull Request pretty soon after from Specify.
In this Pull Request, Specify takes the tokens from your Specify repository and converts them to style-dictionary format inside sd-input folder.

Accept and Merge this Pull Request.

## Style-Dictionary

Now that we have some style-dictionary input files generated automatically from Figma, we can start exporting our design tokens to a platform of our choice.

In this example, we will take [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (or also known as CSS variables).

Inside Backlight, create a `sd.config.cjs` if you don't have one yet. Here you can choose how you'd like to export your tokens, example:

```js
module.exports = {
  source: ['sd-input/**/*.json'],
  css: {
    transformGroup: 'css',
    prefix: 'foo',
    buildPath: '',
    files: [
      {
        destination: '_variables.css',
        format: 'css/variables',
      },
    ],
  },
};
```

You should notice as you change the config, Style Dictionary will run inside Backlight to generate a `_variables.css` under Root Files.
You can now use your Design Tokens in CSS, for example, to create a CSS Button component!

## GitHub Action

To automate everything, we need to take one more step.
When you change tokens in Figma, publish the library, then Sync in Specify, this will create a Pull Request.
In this Pull Request, we will get the new sd-input tokens, but we need to run style-dictionary as well to get the output `_variables.css`.
We can automate that with GitHub Actions. Create a workflow:

`.github/workflows/specify.yaml`:

```yaml
name: Run style-dictionary

on: pull_request

jobs:
  run_if: # only if base branch is "specify"
    if: ${{ github.head_ref == 'specify' }}
    name: Run style-dictionary
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      # checkout to the head of this PR
      - uses: actions/checkout@master
        with:
          repository: ${{ github.event.pull_request.head.repo.full_name }}
          ref: ${{ github.event.pull_request.head.ref }}

      - name: Run style-dictionary
        run: npx style-dictionary build --config sd.config.cjs

      - name: Commit changes
        uses: EndBug/add-and-commit@v9
        with:
          author_name: Example
          author_email: example@gmail.com
          message: 'chore: style-dictionary output'
          add: '.'
```

Make sure to change the `author_name` and `author_email` to use your own information.

This workflow runs upon pull requests activity when the base branch (`head_ref`) equals `specify`, so only the Specify automated PRs.
For regular pull requests, you probably don't need to run this workflow or you have already ran style-dictionary in Backlight.

## Workflow Summary

- Designer changes some tokens (styles) in Figma and publishes the library with changes.
- Designer opens Specify and clicks "Sync"
- A Pull Request is created automatically in GitHub
- Style-Dictionary is ran and results are added to this PR automatically
- A Backlight Preview link will appear in the PR
- Designers (& optionally developers) can see visual changes and review + approve
- Changes are merged into main

Note how 0 developers are needed here!

Code & Design, will be in sync 🎉 and designers will have more autonomy.
