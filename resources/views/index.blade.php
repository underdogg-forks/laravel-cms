@extends('layout')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Most Recent Pages
                    </div>
                    <div class="cms-nav-pill">
                        <div class="panel-body">
                            <div class="panel-body">
                                <ul class="nav" role="tablist">
                                    @foreach($pages as $page)
                                    <li role="presentation">
                                        <a href="/admin/pages#/{{ $page->id }}" role="tab" aria-controls="pages">{{ $page->name }}</a>
                                    </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Statistics
                    </div>

                    <div class="panel-body">

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection