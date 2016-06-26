@extends(themef() . 'layouts.layout')

@section('content')
    <h1>{{ $page->name }} Page</h1>

    {!! $page->content !!}
@endsection