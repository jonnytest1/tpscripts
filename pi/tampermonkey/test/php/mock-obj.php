<?php
    class MockObj{


        public function __construct($name,$att) {
            $this->{$name}=$att;
        }

        public function __call($method, $arguments) {
            $arguments = array_merge(array("stdObject" => $this), $arguments); // Note: method argument 0 will always referred to the main class ($this).
            if (isset($this->{$method}) && is_callable($this->{$method})) {
                return call_user_func_array($this->{$method}, $arguments);
            } else {
                throw new Exception("Fatal error: Call to undefined method stdObject::{$method}()");
            }
        }

    }
?>