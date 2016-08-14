@extends('layout')

@section('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
    <script>
        window.NPAGE = {!! json_encode($page->toArray()) !!};
    </script>
@endsection

@section('content')
    <div class="container pages-page">
        <page inline-template>

            <div v-if="active.id">
                <div class="row">
                    <div class="column xs-12 md-8">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="input-group" v-bind:class="{'has-error': pageErrors.name}">
                                        <label>Page Name:</label>
                                        <input type="text" v-model="active.name" class="input">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-group" v-bind:class="{'has-error': pageErrors.slug}">
                                        <label>URL:</label>
                                        <input type="text" v-model="active.slug" class="input">
                                    </div>
                                </div>
                            </div>
                            <div class="input-group" v-bind:class="{'has-error': pageErrors.template}">
                                <label>Template:</label>
                                <select v-model="active.template" class="input">
                                    <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                </select>
                            </div>

                            <div class="form-group" v-show="!active.markdown">
                                <label>Content:</label>
                                <textarea v-model="active.content" v-ckeditor="active.content" class="richtext" data-maincontent></textarea>
                                <button class="button button-primary" v-on:click.prevent="swapEditor('markdown')">Switch to Markdown</button>
                            </div>

                            <div class="form-group" v-show="active.markdown">
                                <label for="content">Content (Markdown):</label>
                                <textarea class="input" v-model="active.content" v-simplemde="active.content"></textarea>
                                <button class="button button-primary" v-on:click.prevent="swapEditor('richtext')">Switch to RichText</button>
                            </div>
                        </form>

                        <div v-if="!isArray(templateVariables)" class="template-variables">

                            <h3>Template Variables</h3>

                            <div class="tabs">
                                <div class="tabs__heading">
                                    <ul>
                                        <li v-for="(category, fields) in templateVariables" role="presentation" v-bind:class="{'active': $index == 0}" >
                                            <a href="#@{{ category }}" role="tab" data-toggle="tab" aria-controls="@{{ category }}" v-on:click.prevent="activeTab = category">
                                                @{{ category }}
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div class="tabs__content">
                                    <div v-show="activeTab == category" role="tabpanel" v-for="(category, fields) in templateVariables" class="tab-pane" v-bind:class="{'active': $index == 0}" id="@{{ category }}">
                                        <div v-for="(field, property) in fields" class="input-group">

                                            <label for="">@{{ property.caption }}</label>

                                            <div v-if="property.type == 'text'">
                                                <input v-model="tvs[category][field]" type="text" class="input">
                                            </div>

                                            <div v-if="property.type == 'select'">
                                                <select v-model="tvs[category][field]" class="input">
                                                    <option value="" selected></option>
                                                    <option v-for="option in property.options" value="@{{ option }}">@{{ option }}</option>
                                                </select>
                                            </div>

                                            <div v-if="property.type == 'textarea'">
                                                <textarea v-model="tvs[category][field]" class="input"></textarea>
                                            </div>

                                            <div v-if="property.type == 'richtext'">
                                                <textarea v-model="tvs[category][field]" v-ckeditor="tvs[category][field]" class="richtext"></textarea>
                                            </div>

                                            <div v-if="property.type == 'checkbox'">
                                                <input type="checkbox" v-model="tvs[category][field]">
                                            </div>

                                            <div v-if="property.type == 'radio'">
                                                <label class="radio-inline" v-for="option in property.options">
                                                    <input  type="radio" id="@{{ field }}@{{ $index }}" value="@{{ option }}" v-model="tvs[category][field]"> @{{ option }}
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="panel" v-if="active.children">
                            <div class="panel__heading">
                                Child Pages
                            </div>
                            <div class="panel__body">
                                <ul class="nav">
                                    <li v-for="page in active.children" role="presentation">
                                        <a href="#" v-on:click.prevent="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="column xs-12 md-3 md-offset-1">
                        <div class="panel page-actions">
                            <div class="panel__heading">
                                Actions
                            </div>
                            <div class="panel__body">
                                <ul>
                                    <li>
                                        <a href="#" v-on:click.prevent="savePage()">
                                            Save
                                        </a>
                                    </li>

                                    <li v-if="!active.isIndex">
                                        <a href="#" v-if="!active.isIndex" v-on:click.prevent="makeIndex()">
                                            Make Home Page
                                        </a>
                                    </li>

                                    <li v-if="active.status != 'draft'">
                                        <a href="/@{{ active.permalink }}" target="_blank">
                                            View
                                        </a>
                                    </li>

                                    <li v-if="active.status == 'published'">
                                        <a href="#" v-on:click.prevent="changeStatus('draft')">
                                            Make Draft
                                        </a>
                                    </li>

                                    <li v-if="active.status == 'draft'">
                                        <a href="#" v-on:click.prevent="changeStatus('published')">
                                            Publish
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" v-on:click.prevent="deletePage()">
                                            Delete
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </page>
    </div>
@endsection

@section('scripts')
    <script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script>
    <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
@endsection