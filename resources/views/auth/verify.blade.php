@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Verifique su correo electrónico') }}</div>

                <div class="card-body">
                    @if (session('resent'))
                        <div class="alert alert-success" role="alert">
                            {{ __('Al enviar el restablecimiento recibirá un correo electrónico para el cambio de la contraseña') }}
                        </div>
                    @endif

                    {{ __('Despues de esto, por favor verifique la bandeja de entrada de su correo electrónico o intente de nuevo') }}
                    {{ __('Si no recibe este correo electrónico') }},
                    <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                        @csrf
                        <button type="submit" class="btn btn-link p-0 m-0 align-baseline">{{ __('Click aquí para realizar la solicitud') }}</button>.
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
