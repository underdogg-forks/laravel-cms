@extends(themef() . 'layout')

@section('content')
    <h1>Yo</h1>
    <h2>{{ $tvs->header->title }}</h2>

    {!! $page->content !!}
@endsection