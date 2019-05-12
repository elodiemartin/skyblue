<?php
namespace App\Controller;

use \Twig_Loader_Filesystem;
use \Twig_Environment;

class HomeController
{
    private $loader;
    private $twig;


    public function __construct(){
        $this->loader= new Twig_Loader_Filesystem('View');
        $this->twig = new Twig_Environment($this->loader);
    }

    /**Route*/
    public function index(){
        return $this->twig->render('base.html.twig');
    }

    public function error(){
        return $this->twig->render('404.html.twig');
    }

    public function apiJSON(){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://opensky-network.org/api/states/all",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        
        return $response;
    }
    
}



?>