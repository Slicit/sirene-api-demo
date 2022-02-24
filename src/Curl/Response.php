<?php

namespace Curl;

/**
 * Class Response
 * @package Curl
 */
class Response
{
    /**
     * @var mixed
     */
    protected $result;

    /**
     * @var int
     */
    protected $status;

    /**
     * Response constructor.
     * @param $result
     * @param $status
     */
    public function __construct($result, $status)
    {
        $this->result = $result;
        $this->status = (int) $status;
    }

    /**
     * @return mixed
     */
    public function getResult($jsonDecode = false)
    {
        return $jsonDecode ?
            json_decode($this->result, true, 512, JSON_UNESCAPED_UNICODE) :
            $this->result;
    }

    /**
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }
}