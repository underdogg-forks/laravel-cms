# Laravel CMS (Name TBD)

**Foreword**: This is a rough, messy, and conceptual first run at a CMS. Testing (unit, functional, and integration) has not been done. Code structure and design was all done by myself in a night, so things may be overthought and have weird approaches.

With that out of the way...

This is a custom content management system built in Laravel and Vue.js (I'm noticing a few limitations with Vue so I may end up switching).
We use a lot of ModX and WordPress at work (and do an equivalent amount of complaining) so I thought it'd be fun to see how and why those CMS's got the way they did in the first place.

The problem with a lot of CMS's these days is that they aren't very client friendly, so I am keeping that in mind when building this.

## Screenshots

The add new pages screen

![Pages](http://i.imgur.com/0sueBMI.png)


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
  header: #category name (the tab on the editor page to group fields)
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
