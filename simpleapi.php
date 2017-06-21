<?php
// Turn off all error reporting
error_reporting(0);
//http://www.tutorialsface.com/2016/02/simple-php-mysql-rest-api-sample-example-tutorial's     
require_once("Rest.inc.php");

class API extends REST {

    public $data = "";

    //Enter details of your database
    //const DB_SERVER = "127.0.0.1:3306";
    const DB_SERVER = "62.38.149.10:3333";
    //const DB_USER = "root";
    const DB_USER = "thanasis";
    //const DB_PASSWORD = "";
    const DB_PASSWORD = "thanasis12!!";
    const DB = "thanasis";

    private $db = NULL;

    public function __construct() {
        parent::__construct();              // Init parent contructor
        $this->dbConnect();                 // Initiate Database connection
    }

    private function dbConnect() {
        $this->db = mysqli_connect(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
      
		if (mysqli_connect_errno())
		  {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		  }
    }

    /*
     * Public method for access api.
     * This method dynmically call the method based on the query string
     *
     */

    public function processApi() {
        $func = strtolower(trim(str_replace("/", "", $_REQUEST['request'])));

        if ((int) method_exists($this, $func) > 0)
            $this->$func();
        else
            $this->response('Error code 404, Page not found', 404);   // If the method not exist with in this class, response would be "Page not found".
    }

    /*  private function hello() {
      echo str_replace("this", "that", "HELLO WORLD!!");
      } */

    /* private function test() {
      // Cross validation if the request method is GET else it will return "Not Acceptable" status
      if ($this->get_request_method() != "GET") {
      $this->response('', 406);
      }
      $myDatabase = $this->db; // variable to access your database
      $param = $this->_request['var'];
      // If success everythig is good send header as "OK" return param
      $this->response($param, 200);
      } */

    private function createdbtables() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $result = mysqli_query($this->db,'CREATE TABLE `yugisaves` (
                                `unkey` varchar(128) NOT NULL,
                                `json` blob NOT NULL,
								PRIMARY KEY (`unkey`)
							 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
                               
        if (!$result) {
            die($this->response('Invalid query: ' . mysqli_error(), 500));
        }

/*
        $result = mysqli_query($this->db,'ALTER TABLE yugisaves  ADD PRIMARY KEY (`unkey`)');
        if (!$result) {
            die($this->response('Invalid query: ' . mysqli_error(), 500));
        }
*/

        $dbdata['db'] = 'ok';
        $this->response($this->json($dbdata), 200);
    }

    private function dropdbtables() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }


        $result = mysqli_query($this->db,'drop TABLE yugisaves');
        if (!$result) {
            die($this->response('Invalid query: ' . mysqli_error(), 500));
        }

        $dbdata['db'] = 'ok';
        $this->response($this->json($dbdata), 200);
    }

    private function getuserdata() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $unkey = $this->_request['user'];

        $result = mysqli_query($this->db,"SELECT json FROM `yugisaves` WHERE unkey = '$unkey' "); //, $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysqli_error($this->db), 500));
        }
        $row = mysqli_fetch_array($result,MYSQLI_NUM);

		 
		
        $dbdata['data'] = $row[0];

      
        $this->response( $this->json($row[0]), 200);
        
        
    }

    private function setuserdata() {
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        $data = mysqli_real_escape_string($this->db,$this->_request['data']);
        //$data =  $this->_request['data']  ;
        $unkey = $this->_request['user'];


        $result = mysqli_query($this->db,"REPLACE INTO yugisaves (unkey, json) VALUES ('$unkey', '$data'); ");
        if (!$result) {
            die($this->response('Invalid query: ' . mysqli_error(), 500));
        }



        $dbdata['data'] = 'OK';
        $dbdata['unkey'] = $unkey;
        $dbdata['json'] = $data;
		
        $this->response($this->json($dbdata), 200);
    }

    /*
     *  Encode array into JSON
     */

    private function json($data) {
        //if (is_array($data)) {
            return json_encode($data,JSON_UNESCAPED_SLASHES);
        //}
    }

}

// Initiiate Library

$api = new API;
$api->processApi();
?>