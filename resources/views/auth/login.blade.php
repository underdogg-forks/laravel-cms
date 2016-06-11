@extends('layout')

@section('content')
	<login inline-template>
        <div class="container">
            <div class="auth">
                <h1>Login</h1>
                <div class="form-group" v-bind:class="{'has-error': errors.username}">
                    <label class="control-label" for="username" v-if="errors.username">@{{ errors.username }}</label>
                    <input type="text" id="username" v-model="model.username" placeholder="Username" class="form-control">
                </div>
                <div class="form-group" v-bind:class="{'has-error': errors.password}">
                    <label class="control-label" for="username" v-if="errors.password">@{{ errors.password }}</label>
                    <input type="password" v-model="model.password" placeholder="Password" class="form-control">
                </div>
                <div class="form-group">
                    <span class="pull-left"><a href="/register">Need an account?</a></span>
                    <button class="btn btn-primary pull-right" v-on:click="submit()">Login</button>
                </div>
            </div>
        </div>
    </login>
@endsection