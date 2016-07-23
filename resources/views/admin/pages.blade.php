@extends('layout')

@section('styles')

@endsection

@section('content')
    <div class="container pages-page">
        <pages inline-template>

            <div v-if="active.id == undefined">
                <div class="panel">
                    <div class="panel__heading">
                        Pages

                        <a href="#" v-on:click.prevent="showNewPage = !showNewPage" class="right button button-info">New</a>
                    </div>

                    <div class="panel__body">
                        <ul class="nav">
                            <li v-for="page in parentPages" role="presentation" v-bind:class="{ 'active': page.id == active.id }">
                                <a href="#" v-on:click.prevent="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="panel" v-if="showNewPage">
                    <div class="panel__heading">
                        New Page
                    </div>
                    <div class="panel__body">
                        <form v-on:submit.prevent="newPage()">
                            <div class="input-group" v-bind:class="{'has-error': errors.name}">
                                <label class="control-label" for="name" v-if="errors.name">@{{ errors.name }}</label>
                                <input type="text" v-model="model.name" placeholder="Page Name" class="input" required>
                            </div>

                            <div class="input-group">
                                <label for="">Parent</label>
                                <select class="input" v-model="model.parent" >
                                    <option value="" selected></option>
                                    <option v-for="page in pages" value="@{{ page.id }}">@{{ page.name }}</option>
                                </select>
                            </div>

                            <div class="input-group" v-bind:class="{'has-error': errors.template}">
                                <label>Template</label>
                                <select class="input" v-model="model.template" required>
                                    <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="panel__footer">
                        <button type="button" class="button button-primary" v-on:click="newPage()">Save changes</button>
                    </div>
                </div>

            </div>

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
                                <select type="text" v-model="active.template" class="input">
                                    <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Content:</label>
                                <textarea v-model="active.content" v-ckeditor="active.content" class="richtext" data-maincontent></textarea>
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

                        <div class="panel" v-if="active.children.length != 0">
                            <div class="panel__heading">
                                Child Pages
                            </div>
                            <div class="panel__body">
                                <ul class="nav">
                                    <li v-for="page in active.children" role="presentation">
                                        <a href="#" v-on:click="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
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

                                    <li>
                                        <a href="/@{{ active.permalink }}" target="_blank">
                                            View
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


        </pages>
    </div>
@endsection

@section('scripts')
    <script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script>
@endsection