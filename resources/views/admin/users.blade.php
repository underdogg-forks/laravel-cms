@extends('layout')

@section('content')
    <div class="container-fluid admin-users">
        <users inline-template>
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        Users

                        <span class="pull-right">
                            <button class="btn btn-primary" data-toggle="modal" data-target="#newUser">
                                New
                            </button>
                        </span>
                    </div>

                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <div class="panel-body">
                                <ul class="nav" role="tablist">
                                    <li v-for="user in users" role="presentation" v-bind:class="{ 'active': user.id == active.id }">
                                        <a href="#" v-on:click="setActive(user.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ user.username }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="active.id" class="col-md-8">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        @{{ active.username }}

                        <span class="pull-right">
                            <button class="btn btn-danger" v-if="active.id != loggedInUser.id">
                                Delete
                            </button>
                            <button class="btn btn-success" v-on:click="save()">
                                Save
                            </button>
                        </span>
                    </div>

                    <div class="panel-body">
                        <div class="container">
                            <p>User ID: @{{ active.id }}</p>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group" v-bind:class="{'has-error': userErrors.username}">
                                    <label>Username:</label>
                                    <input type="text" v-model="active.username" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group" v-bind:class="{'has-error': userErrors.name}">
                                    <label>Name:</label>
                                    <input type="text" v-model="active.name" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group" v-bind:class="{'has-error': userErrors.password}">
                                    <label>New Password:</label>
                                    <input type="password" v-model="active.password" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group" v-bind:class="{'has-error': userErrors.password_confirmation}">
                                    <label>Confirm Password:</label>
                                    <input type="password" v-model="active.password_confirmation" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="newUser" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">New User</h4>
                        </div>
                        <div class="modal-body">
                            <form v-on:submit.prevent="saveNewUser()">
                                <div class="form-group" v-bind:class="{'has-error': modalErrors.name}">
                                    <label class="control-label" for="name" v-if="modalErrors.name">@{{ modalErrors.name }}</label>
                                    <input type="text" v-model="newUser.name" placeholder="Name" class="form-control" required>
                                </div>

                                <div class="form-group" v-bind:class="{'has-error': modalErrors.username}">
                                    <label class="control-label" for="username" v-if="modalErrors.username">@{{ modalErrors.username }}</label>
                                    <input type="text" v-model="newUser.username" placeholder="Username" class="form-control" required>
                                </div>

                                <div class="form-group" v-bind:class="{'has-error': modalErrors.password}">
                                    <label class="control-label" for="password" v-if="modalErrors.password">@{{ modalErrors.password }}</label>
                                    <input type="password" v-model="newUser.password" placeholder="Password" class="form-control" required>
                                </div>

                                <div class="form-group" v-bind:class="{'has-error': modalErrors.password_confirmation}">
                                    <label class="control-label" for="password_confirmation" v-if="modalErrors.password_confirmation">@{{ modalErrors.password_confirmation }}</label>
                                    <input type="password" v-model="newUser.password_confirmation" placeholder="Confirm Password" class="form-control" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" v-on:click="saveNewUser()">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </users>
    </div>
@endsection