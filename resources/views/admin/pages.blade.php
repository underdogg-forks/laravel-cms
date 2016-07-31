@extends('layout')

@section('styles')

@endsection

@section('content')
    <div class="container pages-page">
        <pages inline-template>

                {{--<div class="panel">--}}
                    {{--<div class="panel__heading">--}}
                        {{--Pages--}}

                        {{--<a href="#" v-on:click.prevent="showNewPage = !showNewPage" class="right button button-info">New</a>--}}
                    {{--</div>--}}

                    {{--<div class="panel__body">--}}
                        {{--<ul class="nav">--}}
                            {{--<li v-for="page in pages" role="presentation">--}}
                                {{--<a href="/admin/pages/@{{ page.id }}" role="tab" data-toggle="tab" aria-controls="pages">@{{ page.name }}</a>--}}
                            {{--</li>--}}
                        {{--</ul>--}}
                    {{--</div>--}}
                {{--</div>--}}

                <div class="panel">
                    <div class="panel__heading">
                        Pages

                        <a href="#" v-on:click.prevent="showNewPage = !showNewPage" class="right button button-info">New</a>
                    </div>

                    <div class="panel__body">
                        <ul class="nav">
                            @foreach ($pages as $page)
                                @include('admin.li', ['child' => $page])
                            @endforeach
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

        </pages>
    </div>
@endsection

@section('scripts')
@endsection