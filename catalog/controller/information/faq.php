<?php
class ControllerInformationFaq extends Controller {
	public function index() {
		$this->load->language('information/faq');
		$this->load->model('fido/faq');

		$this->data['breadcrumbs'] = array();

		$this->data['breadcrumbs'][] = array(
			'href'      => $this->url->link('common/home'),
			'text'      => $this->language->get('text_home'),
			'separator' => FALSE
		);

		$this->data['breadcrumbs'][] = array(
			'href'      => $this->url->link('information/faq'),
			'text'      => $this->language->get('heading_title'),
			'separator' => $this->language->get('text_separator')
		);

		if (isset($this->request->get['topic'])) {
			$topic = '';

			$parts = explode('_', $this->request->get['topic']);

			foreach ($parts as $topic_id) {
				$topic_info = $this->model_fido_faq->getTopic($topic_id);

				if (!$topic) {
					$topic = $topic_id;
				} else {
					$topic .= '_' . $topic_id;
				}

				$this->data['breadcrumbs'][] = array(
					'href'      => $this->url->link('information/faq', 'topic=' . $topic),
					'text'      => $topic_info['title'],
					'separator' => $this->language->get('text_separator')
				);
			}

			$faq_id = array_pop($parts);

			$faq_info = $this->model_fido_faq->getTopic($faq_id);

			$this->data['button_faq'] = $this->language->get('button_faq');

			$this->data['faq'] = $this->url->link('information/faq');

			if ($faq_info) {
				$this->getTopics($faq_id);
			} else {
				$this->getError();
			}
		} else {
			$this->getTopics(0);
		}
	}

	private function getTopics($topic_id) {
		$topic_info = $this->model_fido_faq->getTopic($topic_id);
		$topic_data = $this->model_fido_faq->getTopics($topic_id);

		if ($topic_data) {
	  		$this->document->setTitle($this->language->get('heading_title'));

	  		if ($topic_info) {
		  		$this->data['heading_title'] = $topic_info['title'];

				$this->document->setDescription($topic_info['meta_description']);

		  		$this->data['description'] = html_entity_decode($topic_info['description']);
		  	} else {
		  		$this->data['heading_title'] = $this->language->get('heading_title');

		  		$this->data['description'] = $this->language->get('text_description');
		  	}

			$topic_total = $this->model_fido_faq->getTotalFaqsByTopicId($topic_id);

			if ($topic_total) {
				$this->data['topics'] = array();

				foreach ($this->model_fido_faq->getTopics($topic_id) as $result) {
					if (isset($this->request->get['topic'])) {
						$href = $this->url->link('information/faq', 'topic=' . $this->request->get['topic'] . '_' . $result['faq_id']);
					} else {
						$href = $this->url->link('information/faq', 'topic=' . $result['faq_id']);
					}

					$this->data['topics'][] = array(
						'title' => $result['title'],
						'href'  => $href
					);
				}

	     		$this->data['button_continue'] = $this->language->get('button_continue');

				$this->data['continue'] = $this->url->link('common/home');

				if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/information/faq.tpl')) {
					$this->template = $this->config->get('config_template') . '/template/information/faq.tpl';
				} else {
					$this->template = 'default/template/information/faq.tpl';
				}

				$this->children = array(
					'common/column_left',
					'common/column_right',
					'common/content_top',
					'common/content_bottom',
					'common/footer',
					'common/header'
				);

				$this->response->setOutput($this->render());
			} else {
				$this->getError();
			}
		} else {
			$this->getTopic($topic_id);
		}
  	}

	private function getTopic($topic_id) {
		$topic_info = $this->model_fido_faq->getTopic($topic_id);

		if ($topic_info) {
	  		$this->document->setTitle($topic_info['title']);

			$this->document->setDescription($topic_info['meta_description']);

			$this->data['heading_title'] = $topic_info['title'];

			$this->data['description'] = html_entity_decode($topic_info['description']);

			$topic_total = $this->model_fido_faq->getTotalFaqsByTopicId($topic_id);

			if ($topic_total) {
				$this->getTopics($topic_id);
			}

			if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/information/faq.tpl')) {
				$this->template = $this->config->get('config_template') . '/template/information/faq.tpl';
			} else {
				$this->template = 'default/template/information/faq.tpl';
			}

			$this->children = array(
				'common/column_left',
				'common/column_right',
				'common/content_top',
				'common/content_bottom',
				'common/footer',
				'common/header'
			);

			$this->response->setOutput($this->render());
		} else {
			$this->getError();
		}
	}

	private function getError() {
		if (isset($this->request->get['topic'])) {
			$href = $this->url->link('information/faq', 'topic=' . $this->request->get['topic']);
		} else {
			$href = $this->url->link('information/faq');
		}

		$this->data['breadcrumbs'][] = array(
			'href'      => $href,
			'text'      => $this->language->get('text_error'),
			'separator' => $this->language->get('text_separator')
		);

		$this->document->setTitle($this->language->get('text_error'));

		$this->data['heading_title'] = $this->language->get('text_error');

		$this->data['text_error'] = $this->language->get('text_error');

		$this->data['button_continue'] = $this->language->get('button_continue');

		$this->data['continue'] = HTTP_SERVER . 'index.php?route=common/home';

		if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/error/not_found.tpl')) {
			$this->template = $this->config->get('config_template') . '/template/error/not_found.tpl';
		} else {
			$this->template = 'default/template/error/not_found.tpl';
		}

		$this->children = array(
			'common/column_left',
			'common/column_right',
			'common/content_top',
			'common/content_bottom',
			'common/footer',
			'common/header'
		);

		$this->response->setOutput($this->render());
	}
}
?>
