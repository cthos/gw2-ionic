# coding=utf-8
"""Seeing the cool stuff to do today feature tests."""
import pytest, os

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
def i_have_opened_the_app():
    """I have opened the app."""


@given('I\'m on the daily page')
def im_on_the_daily_page():
    """I'm on the daily page."""


@when('I visit the PVP Tab')
def i_visit_the_pvp_tab():
    """I visit the PVP Tab."""


@when('I visit the WVW Tab')
def i_visit_the_wvw_tab():
    """I visit the WVW Tab."""


@when('I visit the event timers page')
def i_visit_the_event_timers_page():
    """I visit the event timers page."""


@when('the app starts up for the first time')
def the_app_starts_up_for_the_first_time():
    """the app starts up for the first time."""


@when('the data has finished loading')
def the_data_has_finished_loading():
    """the data has finished loading."""


@then('I should see a list of PVE Events')
def i_should_see_a_list_of_pve_events():
    """I should see a list of PVE Events."""


@then('I should see some WVW events, or else')
def i_should_see_some_wvw_events_or_else():
    """I should see some WVW events, or else."""


@then('I should see who I need to slaughter in PVP today')
def i_should_see_who_i_need_to_slaughter_in_pvp_today():
    """I should see who I need to slaughter in PVP today."""


@then('Those bosses won\'t know what hit them')
def those_bosses_wont_know_what_hit_them():
    """Those bosses won't know what hit them."""

