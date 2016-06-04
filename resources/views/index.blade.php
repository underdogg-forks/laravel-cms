@extends('layout')

@section('content')
	<div class="container">
		<form action="" class="auth">
			<h1>Login</h1>
			<div class="form-group">
				<input type="text" placeholder="Username" class="form-control">
			</div>
			<div class="form-group">
				<input type="password" placeholder="Password" class="form-control">
			</div>
			<div class="form-group">
				<span class="pull-left"><a href="/register">Need an account?</a></span>
				<button class="btn btn-primary pull-right" type="submit">Login</button>
			</div>
		</form>
	</div>
@endsection