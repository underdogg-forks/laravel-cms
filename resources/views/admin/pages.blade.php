@extends('layout')

@section('content')
    <div class="container-fluid">
        <pages inline-template>
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        Pages
                        <button class="btn btn-primary pull-right" data-toggle="modal" data-target="#newPage" class="pull-right">
                            New
                        </button>
                    </div>

                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <div class="panel-body">
                                <ul class="nav" role="tablist">
                                    <li v-for="page in pages" role="presentation" v-bind:class="{ 'active': page.id == active.id }">
                                        <a href="#" v-on:click="setActive(page.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        @{{ active.name }}
                        <button class="btn btn-primary pull-right" class="pull-right">
                            Save
                        </button>
                    </div>

                    <div class="panel-body">
                        <form>
                            <div class="form-group row">
                                <div class="col-md-6">
                                    <label>Page Name:</label>
                                    <input type="text" v-model="active.name" class="form-control">
                                </div>
                                <div class="col-md-6">
                                    <label>URL:</label>
                                    <input type="text" v-model="active.slug" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Template:</label>
                                <select type="text" v-model="active.template" class="form-control">
                                    <option v-for="template in templates" value="@{{ template }}">@{{ template }}</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Content:</label>
                                <textarea class="form-control"></textarea>
                            </div>
                        </form>

                        <hr>

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
                                    <input type="@{{ property.type }}" class="form-control">
                                </div>
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

            @include('admin.saveWarning')
        </pages>
    </div>
@endsection