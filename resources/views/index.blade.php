@extends('layout')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3">
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
                            which can be hosted as a standalone website (no need for this cms).
                        </p>

                        <form action="/generate-flat-files" method="post" class="form">
                            <input type="hidden" name="_token" value="{{{ csrf_token() }}}" />
                            <div class="form-group text-center">
                                <button class="btn btn-info">Generate!</button>
                            </div>
                        </form>
                    </div>
                </div>
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