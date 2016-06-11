@extends('layout')

@section('content')
    <div class="container-fluid">
        <themes inline-template>

            <div class="col-md-4">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        Active Theme
                    </div>

                    <div class="panel-body">
                        <h1 class="text-center" style="margin-top:0;">@{{ activeTheme }}</h1>

                        <div class="form-group">
                            <label>Change Theme</label>
                            <select class="form-control" v-model="activeTheme" v-on:change="setActiveTheme()">
                                <option v-for="folder in folders" value="@{{ folder }}">@{{ folder }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
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