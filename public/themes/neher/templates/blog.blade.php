@extends(themef() . 'layout')

@section('content')
    <h1>{{ $page->name }}</h1>

    @foreach($page->children as $child)
        <li><a href="/{{$child->slug}}">{{$child->name}}</a></li>
    @endforeach

    {!! $page->content !!}
@endsection