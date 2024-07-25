<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8" />
    <meta name="description" content="@lang('app.meta.description')">
    <meta name="keywords" content="@lang('app.meta.keywords')">
    <meta name="author" content="HOAI AN">
    <meta property="og:title" content="{{ config('app.name') }}">
    <meta property="og:description" content="@lang('app.meta.description')">
    <meta property="og:image" content="/favicon.ico">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:type" content="website">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet">
    <title>{{ config('app.name') }} - Email Verified</title>
</head>

<body
    style="font-family: Roboto, sans-serif; height: 100vh; display: flex; justify-content: center; align-items: center; text-align: center;">
    <div>
        <h1>Email Verified</h1>
        <p>Your email address has been successfully verified.</p>
        <p>Thank you for confirming your email address. You can now access all features of our website.</p>
    </div>
    <script>
        setTimeout(() => {
            window.location.href = '/'
        }, 5000);
    </script>
</body>

</html>
