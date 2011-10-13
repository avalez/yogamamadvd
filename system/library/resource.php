<?php
abstract class Resource extends Controller
{
    protected $error = array();

    private $etags = array();

    /**
     * Execute a request on this resource.
     * @param Request request The request to execute the resource in the context of
     * @return Response
     */
    function index() {
        // Overwrite response!
        $response = new Response();
        $response->setCompression($this->config->get('config_compression'));
        $response->addHeader('Content-Type: application/json; charset=utf-8');
        $this->response = $response;

        $request = $this->request;
        $requestMethod = $request->server['REQUEST_METHOD'];

        $etag = md5($request->server['REQUEST_URI']);
        if (in_array($etag, $this->etags)) {

            notModified();

        } elseif (method_exists($this, $requestMethod)) {

            $response->addHeader('Etag', '"' . $etag . '"');

            $methodReflection = new ReflectionMethod($this, $requestMethod);
            $requestParametersReflection = new ReflectionProperty('Request', strtolower($requestMethod));
            $requestParameters = $requestParametersReflection->getValue($request);
            $parameters = array();
            foreach ($methodReflection->getParameters() as $param) {
                if ($param->name == 'request') {
                    $parameters[] = $request;
                } elseif ($param->name == 'response') {
                    $parameters[] = $response;
                } else {
                    $parameters[] = $requestParameters[$param->name];
                }
            }

            call_user_func_array(array($this, $requestMethod), $parameters);

        } else {
            $this->error('The HTTP method "' . $requestMethod . '" is not allowed for the resource "' . get_class($this) . '".',
                         Resource::METHODNOTALLOWED);
        }

        // Overwrite response!
        $response->output();
    }

    protected function renderJson($object) {
        $this->responseJson($object, Resource::OK);
    }

    protected function forbidden($message) {
        $this->warning($message, Resource::FORBIDDEN);
    }

    protected function warning($message, $code) {
        if ($message) {
            $this->error['warning'] = $message;
        }
        $this->responseJson($this->error, $code);
    }

    protected function error($message, $code) {
        $this->error['error'] = $message;
        $this->responseJson($this->error, $code);
    }

    protected function responseJson($object, $code) {
        $this->response->addHeader('HTTP/1.1 ' . $code);
        if (!empty($object)) {
            $this->response->setOutput(json_encode($object));
        }
    }

    /**
     * HTTP response code constant
     */
    const OK = 200,
    CREATED = 201,
    NOCONTENT = 204,
    MOVEDPERMANENTLY = 301,
    FOUND = 302,
    SEEOTHER = 303,
    NOTMODIFIED = 304,
    TEMPORARYREDIRECT = 307,
    BADREQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOTFOUND = 404,
    METHODNOTALLOWED = 405,
    NOTACCEPTABLE = 406,
    GONE = 410,
    LENGTHREQUIRED = 411,
    PRECONDITIONFAILED = 412,
    UNSUPPORTEDMEDIATYPE = 415,
    INTERNALSERVERERROR = 500;
}
