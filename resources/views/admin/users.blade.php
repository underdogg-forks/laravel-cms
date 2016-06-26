@extends('layout')

@section('content')
    <div class="container-fluid admin-users">
        <users inline-template>
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading clearfix">
                        Users

                        <span class="pull-right">
                            <button class="btn btn-primary">
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

            <div class="col-md-8">
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
        </users>
    </div>
@endsection