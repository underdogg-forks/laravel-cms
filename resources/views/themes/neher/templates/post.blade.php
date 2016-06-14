@extends('themes.neher.layout')

@section('content')
    <h1>{{ $page->parent->name }}</h1>

    {!! $page->content !!}
@endsection