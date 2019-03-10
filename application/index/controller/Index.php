<?php

namespace app\index\controller;

use think\Controller;
use think\Exception;
use think\Db;
use think\facade\Request;
use think\facade\Config;
use think\facade\Validate;

class Index extends Base
{
    public function initialize() {
      parent::initialize();

    }

    public function index()
    {
        $page = $this->request->param('page/d', 1);

        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);

      	$view_rank = Db::name('articles')
          	->order(['view_count' => 'desc'])
          	->where(['status' => 0])
          	->limit(5)
          	->select();
      	$this->assign("view", $view_rank);
      
        $articles = Db::name('articles a')
            ->order(['top' => 'desc', 'create_at' => 'desc', 'view_count' => 'desc', 'comment_count' => 'desc'])
            ->where(['status' => 0])
            ->join('category c', 'a.category_id = c.id')
            ->field(['a.id' => 'id', 'a.title' => 'title', 'a.abstract' => 'abstract', 'a.content' => 'content', 'a.username' => 'username', 'a.comment_count' => 'comment_count', 'a.view_count' => 'view_count', 'a.create_at' => 'create_at', 'c.name' => 'category', 'a.thumbnail' => 'thumbnail'])
            ->page($page, Config::get('paginate.list_rows'))
            ->select();
      
        $count = Db::name('articles')
          ->where(['status' => 0])
          ->count();
      
        $this->assign('articles', $articles);

        $pageInfo = [
            'curr' => $page,
            'all' => ceil($count / Config::get('paginate.list_rows')),
        ];
        
        $this->assign('page', $pageInfo);

        return $this->view->fetch();
    }
}
