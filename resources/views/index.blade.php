@extends('layout')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Options
                    </div>

                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <ul class="nav" role="tablist">
                                <li role="presentation" class="active">
                                    <a href="#pages" role="tab" data-toggle="tab" aria-controls="pages">Pages</a>
                                </li>
                                <li role="presentation">
                                    <a href="#themes" role="tab" data-toggle="tab" aria-controls="themes">Themes</a>
                                </li>
                                <li role="presentation">
                                    <a href="#settings" role="tab" data-toggle="tab" aria-controls="settings">Settings</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="pages">
                    </div>
                    <div role="tabpanel" class="tab-pane" id="themes">

                    </div>
                    <div role="tabpanel" class="tab-pane" id="settings">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection