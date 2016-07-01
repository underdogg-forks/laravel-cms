@extends('layout')

@section('styles')
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
@endsection

@section('content')
    <dashboard inline-template>
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
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            Generate Static Site
                        </div>

                        <div class="panel-body">

                            @if(session('message'))
                                <div class="alert text-center alert-success" style="word-wrap: break-word;">
                                    {{ session('message') }}
                                </div>
                            @endif

                            <p class="text-center">
                                Clicking this button will take all of your pages and assets from your theme and generate a folder
                                which can be hosted as a standalone website.
                            </p>

                            <form action="/generate-flat-files" method="post" class="form">
                                <input type="hidden" name="_token" value="{{{ csrf_token() }}}" />
                                <div class="form-group text-center">
                                    <button class="btn btn-info">Generate!</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-9">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="panel panel-success">
                                <div class="panel-heading">
                                    Total Page Views
                                </div>
                                <div class="panel-body text-center">
                                    <h2>{{ $totalPageViews }}</h2>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-8">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    Top performing pages
                                </div>
                                <div class="panel-body">
                                    <div id="pageViewChart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dashboard>
@endsection