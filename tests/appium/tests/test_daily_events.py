# coding=utf-8
"""Seeing the cool stuff to do today feature tests."""
import pytest, os, time

from selenium.webdriver.common.by import By

from pytest_bdd import (
    given,
    scenario,
    then,
    when,
)

@pytest.fixture
def pytestbdd_feature_base_dir():
    return os.path.dirname(os.path.realpath(__file__)) + '/../'


@scenario('features/daily_events.feature', 'Boss Timers are my jam')
def test_boss_timers_are_my_jam():
    """Boss Timers are my jam."""


@scenario('features/daily_events.feature', 'Seeing Daily PVE Events')
def test_seeing_daily_pve_events():
    """Seeing Daily PVE Events."""


@scenario('features/daily_events.feature', 'Seeing those sweet PVP Events')
def test_seeing_those_sweet_pvp_events():
    """Seeing those sweet PVP Events."""


@scenario('features/daily_events.feature', 'WVW is where it\'s at')
def test_wvw_is_where_its_at():
    """WVW is where it's at."""


@given('I have opened the app')
def i_have_opened_the_app(context):
    """I have opened the app."""
    webview = context.driver.contexts[-1]
    i = 0
    while True:
        try:
            context.driver.switch_to.context(webview)
            break
        except:
            time.sleep(2)
        finally:
            i += 1
            if i >= 5:
                break


@given('I\'m on the daily page')
def im_on_the_daily_page(context):
    cordova_navigate(context, "/tab/pve")
    time.sleep(2)


@when('I visit the PVP Tab')
def i_visit_the_pvp_tab(context):
    cordova_navigate(context, "/tab/pvp")
    time.sleep(4)


@when('I visit the WVW Tab')
def i_visit_the_wvw_tab(context):
    cordova_navigate(context, "/tab/wvw")
    time.sleep(4)


@when('I visit the event timers page')
def i_visit_the_event_timers_page(context):
    cordova_navigate(context, "/tab/events")
    time.sleep(4)


@when('the app starts up for the first time')
def the_app_starts_up_for_the_first_time():
    """the app starts up for the first time."""


@when('the data has finished loading')
def the_data_has_finished_loading(context):
    while True:
        try: 
            spin = context.driver.find_element_by_name('ion-spinner')
            time.sleep(.5)
        except:
            break


@then('I should see a list of PVE Events')
def i_should_see_a_list_of_pve_events(context):
    """I should see a list of PVE Events."""
    pve = context.driver.find_elements(By.CSS_SELECTOR, '.daily-pve .item')
    assert len(pve) > 0


@then('I should see some WVW events, or else')
def i_should_see_some_wvw_events_or_else(context):
    wvw = context.driver.find_elements(By.CSS_SELECTOR, '.daily-wvw .item')
    assert len(wvw) > 0


@then('I should see who I need to slaughter in PVP today')
def i_should_see_who_i_need_to_slaughter_in_pvp_today(context):
    pvp = context.driver.find_elements(By.CSS_SELECTOR, '.daily-pvp .item')
    assert len(pvp) > 0


@then('Those bosses won\'t know what hit them')
def those_bosses_wont_know_what_hit_them(context):
    evs = context.driver.find_elements(By.CSS_SELECTOR, '.event-item')
    assert len(evs) > 0

# TODO: Move this somewhere common.
def cordova_navigate(context, destination):
    uri_stack = context.driver.current_url.split('#')
    return context.driver.get(uri_stack[0] + "#" + destination)