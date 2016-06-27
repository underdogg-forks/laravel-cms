# Laravel CMS (Name TBD)

**Foreword**: This is a rough, messy, and conceptual first run at a CMS. Testing (unit, functional, and integration) has not been done. Code structure and design was all done by myself in a night, so things may be overthought and have weird approaches.

With that out of the way...

This is a custom content management system built in Laravel and Vue.js (I'm noticing a few limitations with Vue so I may end up switching).
We use a lot of ModX and WordPress at work (and do an equivalent amount of complaining) so I thought it'd be fun to see how and why those CMS's got the way they did in the first place.

The problem with a lot of CMS's these days is that they aren't very client friendly, so I am keeping that in mind when building this.

## Screenshots

The add new pages screen

![Pages](http://i.imgur.com/MGkUQeC.png)


... More to come

## Features

So far all of my features and todos have been kept in my Wunderlist, but I'll try and migrate them to GitHub issues.

**Working so far as of writing this**

(And by working I mean baseline functional with obvious need for improvement)

* Theme switching
* Theme detection
* Adding new pages
* Detecting template files
* Attaching templates to pages
* Defining template variables
* Adding content to template variables
* Displaying actual pages after being created
* Nested pages

## Structure

### Themes

Themes are stored in `public/themes/`.

If I wanted my theme to be called `my-theme` I would make the folder `public/themes/my-theme/` and put all my theme related files in here.
(I have future plans to move all theme related information into a `theme.yaml` file).

Right now themes are not stored in the database. They are simply pulled by directory name, as only one theme can be active at a time.
The current active theme is stored in the sites configuration file in `storage/site/config.yaml`.

### Template Variables

TVs are defined in a `variables.yaml` file located in your themes directory

The TV structure is as follows

```yaml
index: #template name
  header: #category name (required. this is the tab on the editor page to group fields)
    title: #field name
        type: text #field type
        caption: Title #field label for front end
    subtitle:
        type: text
        caption: Subtitle

  footer:
    copy:
      type: text
      caption: Copyright Text
```

### Views

Inside your themes directory, you need to create a folder called templates. Inside here is where all of you pages templates will be stored.
Templates use the `.blade.php` extension and have all of the lovely benefits of Laravel Blade.

You can access your template variables from your views by simply writing in the convention of `{{ $tvs->category->field }}`.
So for the above example, referencing the subtitle field would look like `{{ $tvs->header->subtitle}}`

You also have access to the `$page` variable which has information like the page name, slug, content, template, and even child pages (via `$page->children`).

For referencing your theme folder in your views, the `{{ themef() }}` function is available. This outputs `my-theme::` (the active theme name) and then lets you reference any files from within your theme folder. This is useful for referencing layouts. Example: `@extend(themef() . 'layouts.baseLayout')` which will grab the file `/public/themes/my-theme/layouts/baseLayout.blade.php`.

For linking assets, you'll want to use the `{{ themeAssets() }}` function which outputs `/public/themes/my-theme/assets` (**no trailing slash**).
Example: `<link rel="stylesheet" href="{{ themeAssets() }}/css/style.css">`

# Getting Started

## Installing

Getting started is simple:

    1. Clone this repo to the directory of your choice
    2. Make a .env file `$ cp .env.example .env`
    3. Fill in your DB credentials
    4. Run `$ php artisan migrate`

## Adding your theme

Head on over to the `/public/themes` directory and create a folder named whatever you'd like. This will be your theme name (note: it cannot contain spaces or special characters).

Inside your theme folder, create a directory structure like so:

```
/my-theme
    /assets
    /partials
    /templates
    /layouts
    variables.yaml
```

The only folder required here is  `/templates/`. This is because the CMS searches this folder when creating a new page for a template to use.

All of your assets (css, js, images) need to be in the `assets` folder (you'll see why in a bit). I like to have a `/partials` folder for any markup I use more than once. Also, a `/layouts` folder for containing different layouts generally used by all pages (e.g contains all of the `<html><head><body>` code and then includes different content sections). Lastly, a file named `variables.yaml` in the `root` directory of your theme needs to be present if you want to have custom fields for your templates. Refer to the sections above for how to define variables.

For a better understanding of how the structure works, take a look at the example theme included with the install.

After you've added your theme (at least created the directory in the `/public/themes` folder), go ahead and navigate to your websites `/admin` URL. Log in using the default user (username: `admin`, password: `admin` make sure to remove this later), and then click the `themes` link in the top navigation bar. Here you can use the dropdown to select and activate your theme!

## Creating a page

Once you've added your theme, it's time to create our first page (**make sure you've created at least one template inside your themes `/template` folder**). Let's click the top `pages` link in the navbar. Here you're presented with a sidebar to the left that lists all of your top-level pages; let's create one. Click the `new` button on the left sidebar and you'll be prompted with a few options. Fill out your theme's: name, parent page (optional), and the template.

After it's been created, you can actually view it right away. On the page options to the right, click the "view" button in the top right of the panel. Tada! You've made your first page. If you close out of that page and go back to the admin area, you can see different fields you can customize. If you've added any template variables for this template, they will also appear in the right hand panel.

Creating child pages is just as easy, go ahead and create a page the same way you did last time, but this time specifying a parent page. Once you've saved the new page, it will be accessible at `/parent-slug/child-slug`. Child pages are infinitely nestable.