<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\sessionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*
Group routes for middleware auth to validate session line 24
Group routes for controller UserController line 25
Group routes for controller PostController line 31
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('user/{user}', 'show')->name('api.user.show');
        Route::get('user', 'index')->name('api.user.index')->middleware(['abilities:admin']);
        Route::get('user/filter/{filter}', 'filterUser')->name('api.user.filter')->middleware(['abilities:admin']);
    });
    Route::post('logout', [SessionController::class, 'logout'])->name('api.user.logout');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::controller(AdminController::class)->group(function (){
        Route::get('user/admin/user-state', 'userState')->name('api.user.admin.user.state')->middleware(['abilities:admin']);
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::controller(PostController::class)->group(function () {
        Route::post('post', 'create')->name('api.post.create')->middleware(['ability:admin,student']);
        Route::get('post/{post}' , 'show')->name('api.post.show')->middleware(['ability:admin,student,teacher']);
        Route::get('post', 'index')->name('api.post.index');
        Route::get('post/relevant/students', 'relevant')->name('api.post.relevant')->middleware(['abilities:student']);
        Route::get('post/filter/{post}', 'filterPosts')->name('api.post.filter');
        Route::get('post/files/{post}', 'filesPost')->name('api.post.files');
        Route::get('post/user/posts/{user}', 'postsOfUser')->name('api.user.posts')->middleware(['ability:admin,student,teacher']);
        Route::get('post/destroy/{post}', 'destroy')->name('api.post.destroy')->middleware(['ability:student']);
    });
});


Route::post('user', [UserController::class, 'create'])->name('api.user.create');
Route::post('login', [SessionController::class, 'login'])->name('api.user.login');
