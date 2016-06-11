@extends('layout')

@section('content')
    <register inline-template>
        <div class="container">
            <div class="auth">
                <h1>Register</h1>

                <form v-on:submit.prevent="submit()">
                    <div class="form-group" v-bind:class="{'has-error': errors.name}">
                        <label class="control-label" for="name" v-if="errors.name">@{{ errors.name }}</label>
                        <input type="text" id="name" v-model="model.name" placeholder="Your Name" class="form-control" >
                    </div>
                    <div class="form-group" v-bind:class="{'has-error': errors.username}">
                        <label class="control-label" for="username" v-if="errors.username">@{{ errors.username }}</label>
                        <input type="text" id="username" v-model="model.username" placeholder="Username" class="form-control" >
                    </div>
                    <div class="form-group" v-bind:class="{'has-error': errors.password}">
                        <label class="control-label" for="password" v-if="errors.password">@{{ errors.password }}</label>
                        <input type="password" v-model="model.password" placeholder="Password" class="form-control" >
                    </div>
                    <div class="form-group" v-bind:class="{'has-error': errors.password_confirmation}">
                        <label class="control-label" for="password_confirmation" v-if="errors.password">@{{ errors.password_confirmation }}</label>
                        <input type="password" v-model="model.password_confirmation" placeholder="Confirm Password" class="form-control" >
                    </div>
                    <div class="form-group">
                        <span class="pull-left"><a href="/login">Have an account?</a></span>
                        <button class="btn btn-primary pull-right">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </register>
@endsection