@extends(themef() . 'layouts.layout')

@section('content')
    <h1>{{ $page->title }} Page</h1>
    <h2>{{ $tvs->header->title }}</h2>

    {!! $page->content !!}
@endsection