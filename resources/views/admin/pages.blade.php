@extends('layout')

@section('content')
    <div class="container-fluid">
        <pages inline-template>
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        Pages

                        <button class="btn btn-primary pull-right" data-toggle="modal" data-target="#newPage" class="pull-right" v-on:click="model.parent = active.id">
                            New
                        </button>
                    </div>

                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <div class="panel-body">
                                <ul class="nav" role="tablist">
                                    <li v-for="page in parentPages" role="presentation" v-bind:class="{ 'active': page.id == active.id }">
                                        <a href="#" v-on:click="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-8" v-if="active.id">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        @{{ active.name }} <span v-if="active.isIndex">- Home Page</span>

                        <span class="pull-right">
                            <button class="btn btn-danger" v-on:click="deletePage()" class="pull-right">
                                Delete
                            </button>
                            <button v-if="!active.isIndex" class="btn btn-warning" v-on:click="makeIndex()" class="pull-right">
                                Make Home Page
                            </button>
                            <a href="/@{{ active.permalink }}" target="_blank" class="btn btn-primary" class="pull-right">
                                View
                            </a>
                            <button class="btn btn-success" v-on:click="savePage()" class="pull-right">
                                Save
                            </button>
                        </span>
                    </div>

                    <div class="panel-body">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group" v-bind:class="{'has-error': pageErrors.name}">
                                        <label>Page Name:</label>
                                        <input type="text" v-model="active.name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group" v-bind:class="{'has-error': pageErrors.slug}">
                                        <label>URL:</label>
                                        <input type="text" v-model="active.slug" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-bind:class="{'has-error': pageErrors.template}">
                                <label>Template:</label>
                                <select type="text" v-model="active.template" class="form-control">
                                    <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Content:</label>
                                <textarea v-model="active.content" v-trix></textarea>
                            </div>
                        </form>

                        <div v-if="!isArray(templateVariables)">

                            <hr>

                            <h3>Template Variables</h3>

                            <ul class="nav nav-tabs">
                                <li v-for="(category, fields) in templateVariables" role="presentation" v-bind:class="{'active': $index == 0}" >
                                    <a href="#@{{ category }}" role="tab" data-toggle="tab" aria-controls="@{{ category }}">
                                        @{{ category }}
                                    </a>
                                </li>
                            </ul>

                            <div class="tab-content">
                                <div role="tabpanel" v-for="(category, fields) in templateVariables" class="tab-pane" v-bind:class="{'active': $index == 0}" id="@{{ category }}">
                                    <div v-for="(field, property) in fields" class="form-group">
                                        <label for="">@{{ property.caption }}</label>
                                        <input v-model="tvs[category][field]" type="@{{ property.type }}" class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel panel-default" v-if="active.children.length != 0">
                    <div class="panel-heading">
                        Child Pages
                    </div>

                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <div class="panel-body">
                                <ul class="nav" role="tablist">
                                    <li v-for="page in active.children" role="presentation">
                                        <a href="#" v-on:click="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="newPage" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">New Page</h4>
                        </div>
                        <div class="modal-body">
                            <form v-on:submit.prevent="newPage()">
                                <div class="form-group" v-bind:class="{'has-error': errors.name}">
                                    <label class="control-label" for="name" v-if="errors.name">@{{ errors.name }}</label>
                                    <input type="text" v-model="model.name" placeholder="Page Name" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label for="">Parent</label>
                                    <select class="form-control" v-model="model.parent" >
                                        <option value="" selected></option>
                                        <option v-for="page in pages" value="@{{ page.id }}">@{{ page.name }}</option>
                                    </select>
                                </div>

                                <div class="form-group" v-bind:class="{'has-error': errors.template}">
                                    <label class="control-label" for="template" v-if="errors.template">@{{ errors.template }}</label>
                                    <select class="form-control" v-model="model.template" required>
                                        <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" v-on:click="newPage()">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

        </pages>
    </div>
@endsection

@section('scripts')
    {{--<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>--}}
    {{--<script>tinymce.init({ selector:'textarea' });</script>--}}
@endsection