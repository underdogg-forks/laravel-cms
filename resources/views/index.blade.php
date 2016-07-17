@extends('layout')

@section('styles')
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
@endsection

@section('content')
    <dashboard inline-template class="index-page">
        <div class="container">

            <div class="panel top-pages">
                <div class="panel__heading">
                    Top Performing Pages
                </div>
                <div class="panel__body">
                    <div id="pageViewChart"></div>
                </div>
            </div>

            <div class="row">
                <div class="column xs-12 md-5">
                    <div class="panel recent-pages">
                        <div class="panel__heading">
                            Recently Updated
                        </div>
                        <div class="panel__body">
                            <ul>
                                @foreach($pages as $page)
                                <li>
                                    <a href="/admin/pages#/{{ $page->id }}" role="tab" aria-controls="pages">{{ $page->name }}</a>
                                </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="column xs-12 md-5 md-offset-2">
                    <div class="panel">
                        <div class="panel__heading">
                            Generate Static Site
                        </div>

                        <div class="panel__body">

                            @if(session('message'))
                                <div class="alert text-center alert-success" style="word-wrap: break-word;">
                                    {{ session('message') }}
                                </div>
                            @endif

                            <form action="/generate-flat-files" method="post" class="form">
                                <input type="hidden" name="_token" value="{{{ csrf_token() }}}" />
                                <div class="input-group text-center">
                                    <button class="button button-info">Generate!</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dashboard>
@endsection