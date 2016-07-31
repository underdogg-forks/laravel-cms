<li>
    <a href="/admin/pages/{{ $child->id }}">{{ $child->name }}</a>

    @if ($child->children()->count())
        <ul>
            @foreach($child->children as $c)
                @include('admin.li', ['child' => $c])
            @endforeach
        </ul>
    @endif
</li>