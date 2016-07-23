@extends('layout')

@section('content')
    <div class="container-fluid admin-users">
        <users inline-template>
            <div v-if="active.id == undefined" class="column md-8 md-offset-2">
                <div class="panel">
                    <div class="panel__heading clearfix">
                        Users

                        <button class="button button-primary right" v-on:click="showNewUser = !showNewUser">
                            New
                        </button>
                    </div>

                    <div class="panel__body">
                        <ul class="nav" role="tablist">
                            <li v-for="user in users" role="presentation" v-bind:class="{ 'active': user.id == active.id }">
                                <a href="#" v-on:click.prevent="setActive(user.id)" role="tab" data-toggle="tab" aria-controls="pages">@{{ user.username }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="panel" v-if="showNewUser">
                    <div class="panel__heading">
                        New User
                    </div>
                    <div class="panel__body">
                        <form v-on:submit.prevent="saveNewUser()">
                            <div class="input-group" v-bind:class="{'has-error': modalErrors.name}">
                                <label>Name</label>
                                <input type="text" v-model="newUser.name" placeholder="Name" class="input" required>
                            </div>

                            <div class="input-group" v-bind:class="{'has-error': modalErrors.username}">
                                <label>Username</label>
                                <input type="text" v-model="newUser.username" placeholder="Username" class="input" required>
                            </div>

                            <div class="input-group" v-bind:class="{'has-error': modalErrors.password}">
                                <label>Password</label>
                                <input type="password" v-model="newUser.password" placeholder="Password" class="input" required>
                            </div>

                            <div class="input-group" v-bind:class="{'has-error': modalErrors.password_confirmation}">
                                <label>Confirm Password</label>
                                <input type="password" v-model="newUser.password_confirmation" placeholder="Confirm Password" class="input" required>
                            </div>
                        </form>
                    </div>
                    <div class="panel__footer">
                        <button type="button" class="button button-primary" v-on:click="saveNewUser()">Save changes</button>
                    </div>
                </div>
            </div>

            <div v-if="active.id" class="column md-8 md-offset-2">
                <div class="panel">
                    <div class="panel__heading clearfix">
                        @{{ active.username }}

                        <span class="right">
                            <button class="button button-danger" v-if="active.id != loggedInUser.id" v-on:click="deleteUser()">
                                Delete
                            </button>
                            <button class="button button-success" v-on:click="save()">
                                Save
                            </button>
                        </span>
                    </div>

                    <div class="panel__body">
                        <div class="container">
                            <p>User ID: @{{ active.id }}</p>
                        </div>
                        <div class="row">
                            <div class="column md-6">
                                <div class="input-group" v-bind:class="{'has-error': userErrors.username}">
                                    <label>Username:</label>
                                    <input type="text" v-model="active.username" class="input">
                                </div>
                            </div>
                            <div class="column md-6">
                                <div class="input-group" v-bind:class="{'has-error': userErrors.name}">
                                    <label>Name:</label>
                                    <input type="text" v-model="active.name" class="input">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="column md-6">
                                <div class="input-group" v-bind:class="{'has-error': userErrors.password}">
                                    <label>New Password:</label>
                                    <input type="password" v-model="active.password" class="input">
                                </div>
                            </div>
                            <div class="column md-6">
                                <div class="input-group" v-bind:class="{'has-error': userErrors.password_confirmation}">
                                    <label>Confirm Password:</label>
                                    <input type="password" v-model="active.password_confirmation" class="input">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </users>
    </div>
@endsection