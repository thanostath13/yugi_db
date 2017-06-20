<?php

//*****************************************************************************************
//                                      Simpleapi.php
//*****************************************************************************************
//
////reference *****************************************************************************
//http://www.tutorialsface.com/2016/02/simple-php-mysql-rest-api-sample-example-tutorial's  
//*****************************************************************************************


require_once("Rest.inc.php");

class API extends REST {

    public $data = "";

    //Enter details of our database
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
        $this->db = mysql_connect(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD);
        if ($this->db)
            mysql_select_db(self::DB, $this->db);
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
        // If the method not exist with in this class, response would be "Page not found".
            $this->response('Error code 404, Page not found', 404);
    }

//*****************************************************************************************
//                                     createdbtables
//*****************************************************************************************

    private function createdbtables() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }
        // create our table yugisaves (2 columns table) 
        $result = mysql_query('CREATE TABLE `yugisaves` (
                                `unkey` varchar(128) NOT NULL,
                                `json` longtext
                              )', $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysql_error(), 500));
        }


        $result = mysql_query('ALTER TABLE yugisaves  ADD PRIMARY KEY (`unkey`)', $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysql_error(), 500));
        }


        $dbdata['db'] = 'ok';
        $this->response($this->json($dbdata), 200);
    }

//*****************************************************************************************
// 					dropdbtables
//*****************************************************************************************

    private function dropdbtables() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        // drop our table yugisaves (2 columns table) 
        $result = mysql_query('drop TABLE yugisaves', $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysql_error(), 500));
        }

        $dbdata['db'] = 'ok';
        $this->response($this->json($dbdata), 200);
    }

//*****************************************************************************************
//                              	getuserdata
//*****************************************************************************************

    private function getuserdata() {
        if ($this->get_request_method() != "GET") {
            $this->response('', 406);
        }

        $unkey = $this->_request['user'];

        $result = mysql_query("SELECT json FROM `yugisaves` WHERE unkey = '$unkey' ", $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysql_error(), 500));
        }
        $row = mysql_fetch_array($result);

        $dbdata['data'] = $row[0];

        $this->response($this->json($dbdata), 200);
    }

//*****************************************************************************************
//                  			setuserdata
//*****************************************************************************************

    private function setuserdata() {
        if ($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        $data = mysql_real_escape_string($this->_request['data']);
        $unkey = $this->_request['user'];


        $result = mysql_query("REPLACE INTO yugisaves (unkey, json) VALUES ('$unkey', '$data'); ", $this->db);
        if (!$result) {
            die($this->response('Invalid query: ' . mysql_error(), 500));
        }

        $dbdata['data'] = 'OK';
        $this->response($this->json($dbdata), 200);
    }

    /*
     *  Encode array into JSON
     */

    private function json($data) {
        if (is_array($data)) {
            return json_encode($data);
        }
    }

}

// Initiiate Library

$api = new API;
$api->processApi();
?>