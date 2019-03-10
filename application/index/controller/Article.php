<?php
/**
 * Created by PhpStorm.
 * User: HULANG-BTB
 * Date: 2019/3/6
 * Time: 14:33
 */

namespace app\index\controller;

use think\Controller;
use think\Exception;
use think\Db;
use think\facade\Request;
use think\facade\Config;
use think\facade\Validate;

class Article extends Base
{

    public function read() {
        $id = $this->request->param('id');
        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);
        $article = Db::name('articles')
            ->where(['id' => $id])
            ->find();
        if (!$article) {
            return $this->error('非法操作');
        }
        Db::name('articles')->where(['id' => $article['id']])->setInc('view_count', 1);
      
      	$view_rank = Db::name('articles')
          	->order(['view_count' => 'desc'])
          	->where(['status' => 0])
          	->limit(5)
          	->select();
      	$this->assign("view", $view_rank);
      
        $tags_list = explode("|", $article['tags_list']);
        $thistags = Db::name('tags')
            ->where('id', 'in', $tags_list)
            ->select();

        $category = Db::name('category')
            ->where(['id' => $article['category_id']])
            ->find();

        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);
      	$this->assign('title', $article['title'] . '|' . $this->webTitle);
        $this->assign('article', $article);
        $this->assign('thistags', $thistags);
        $this->assign('category', $category);
      
        return  $this->view->fetch();
    }

}