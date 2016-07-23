@extends('layout')

@section('content')
    <div class="container-fluid">
        <themes inline-template>

            <div class="column md-4">
                <div class="panel">
                    <div class="panel__heading">
                        Active Theme
                    </div>

                    <div class="panel__body">
                        <h1 class="text-center" style="margin-top:0;">@{{ activeTheme }}</h1>

                        <div class="input-group">
                            <label>Change Theme</label>
                            <select class="input" v-model="activeTheme" v-on:change="setActiveTheme()">
                                <option v-for="folder in folders" value="@{{ folder }}">@{{ folder }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="column md-8">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Theme Settings
                    </div>

                    <div class="panel-body">
                    </div>
                </div>
            </div>

        </themes>
    </div>
@endsection