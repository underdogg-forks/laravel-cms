<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddParentToPages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->integer('parent_id')->unsigned()->nullable()->default(null);
            $table->foreign('parent_id')->references('id')->on('pages')->onDelete('cascade');
        });

        DB::table('pages')->insert([
            'name' => 'Index',
            'slug' => 'index',
            'template' => 'index',
            'content' => 'My first page!'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign('pages_parent_id_foreign');
            $table->dropColumn('parent_id');
        });
    }
}
