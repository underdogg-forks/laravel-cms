@extends('layout')

@section('content')
	<login inline-template>
        <div class="container auth">
            <div>
                <h1>Login</h1>
                <form v-on:submit.prevent="submit()">
                    <div class="input-group" v-bind:class="{'has-error': errors.username}">
                        <label class="control-label" for="username" v-if="errors.username">@{{ errors.username }}</label>
                        <input type="text" id="username" v-model="model.username" placeholder="Username" class="input">
                    </div>
                    <div class="input-group" v-bind:class="{'has-error': errors.password}">
                        <label class="control-label" for="username" v-if="errors.password">@{{ errors.password }}</label>
                        <input type="password" v-model="model.password" placeholder="Password" class="input">
                    </div>
                    <div class="input-group">
                        <button class="button button-primary pull-right" v-on:click="submit()">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </login>
@endsection