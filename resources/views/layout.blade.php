<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<meta name="token" content="{{ csrf_token() }}">
	<title>@yield('title', 'CMS')</title>
    <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="/css/app.css">
	@yield('styles')
</head>
<body>
	<nav>
		<div class="nav-wrapper">

			<a href="/admin" class="logo">
				CMS
			</a>

			<div class="hamburger">Menu</div>

			<ul class="menu">
                @if (Auth::check())
                    <li><a href="/admin/pages">Pages</a></li>
                    <li><a href="/admin/themes">Themes</a></li>
                    <li><a href="/admin/users">Users</a></li>
                   <li><a href="/logout">Logout</a></li>
                @else
                    <li><a href="/login">Login</a></li>
                @endif
			</ul>

		</div>
	</nav>

    <div class="wrapper">
        @yield('content')
    </div>

	<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
	@yield('scripts')
	<script src="/js/bootstrap.js"></script>
</body>
</html>