<template lang="pug">
.search-box.flex.gap-1
  .site-container.tabber.card(:class='{ "loading-cover": loadingRef.site }')
    h3 Site
    .inner(v-if='!ctx.selected.siteUrl')
      .tabber-tabs
        a(
          @click='ctx.input.siteBy = "name"',
          :class='{ "tab-active": ctx.input.siteBy === "name" }'
        ) BY NAME
        a(
          @click='ctx.input.siteBy = "url"',
          :class='{ "tab-active": ctx.input.siteBy === "url" }'
        ) BY URL
      .tabber-contents
        .by-name(v-if='ctx.input.siteBy === "name"')
          input(
            v-model='ctx.input.siteName',
            @keydown.enter='handleSiteSearch',
            placeholder='Site name'
          )
        .by-url(v-if='ctx.input.siteBy === "url"')
          input(
            v-model='ctx.input.siteUrl',
            @keydown.enter='handleSiteSearch',
            placeholder='yourwiki.com'
          )
      .result-container(v-if='ctx.result.siteList.length')
        .flex-list
          .list-item.card.header
            .val Site results
          .list-item.card(
            v-for='(item, index) in ctx.result.siteList',
            style='cursor: pointer',
            @click.stop='handleSiteSelect(item)'
          )
            .val
              strong.site-name {{ item.siteName }}
              .site-desc(style='font-weight: 400')
                router-link(
                  :to='{ name: "by-site", query: { siteUrl: item.siteUrl } }'
                ) details
                | &nbsp;|&nbsp;
                e-link(:href='item.siteUrl') {{ item.siteUrl }}
    .is-selected(v-if='ctx.selected.siteUrl', @click.stop='')
      .flex-list
        .list-item.card
          .key {{ ctx.selected.siteName }}
          .val {{ ctx.selected.siteUrl }}
          .val(style='flex: 0')
            a.pointer.plain.remove-btn(@click='handleSiteRemove')
              icon
                times-icon
      p.desc
        router-link(
          :to='{ name: "by-site", query: { siteUrl: ctx.selected.siteUrl } }'
        ) Details of selected site →

  .user-container.card(:class='{ "loading-cover": loadingRef.user }')
    h3 User
    .inner(v-if='!ctx.selected.userName')
      label.desc(for='user-input') {{ ctx.selected.siteUrl ? 'Search users in ' + ctx.selected.siteName : 'Fuzzy search' }}
      .by-name
        input#user-input(
          v-model='ctx.input.userName',
          @keydown.enter='handleUserSearch',
          placeholder='User name'
        )
      .result-container(v-if='ctx.result.userList.length')
        .flex-list
          .list-item.card.header
            .val User results
          .list-item.card(
            v-for='(item, index) in ctx.result.userList',
            style='cursor: pointer',
            @click.stop='handleUserSelect(item)'
          )
            .val
              strong.site-name {{ item.userName }}
              .site-url {{ item.siteName }} ({{ item.siteUrl }})
              .user-desc(style='font-weight: 400')
                router-link(
                  :to='{ name: "by-user", query: { siteUrl: item.siteUrl, userName: item.userName } }'
                ) details
                | &nbsp;|&nbsp;
                e-link(:href='`${item.siteUrl}/User:${item.userName}`') profile
    .is-selected(v-if='ctx.selected.userName', @click.stop='')
      .flex-list
        .list-item.card
          .key {{ ctx.selected.userName }}@{{ ctx.selected.siteName }}
          .val {{ ctx.selected.siteUrl }}
          .val(style='flex: 0')
            a.pointer.plain.remove-btn(@click='handleUserRemove')
              icon
                times-icon
      p.desc
        router-link(
          :to='{ name: "by-user", query: { siteUrl: ctx.selected.siteUrl, userName: ctx.selected.userName } }'
        ) Details of selected user →
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { API_BASE } from '../config'
import { Times as TimesIcon } from '@vicons/fa'
import { searchContext as ctx, searchModalShow } from './states'

const loadingRef = ref({ site: false, user: false })

function handleSiteSearch() {
  loadingRef.value.site = true
  axios
    .get(`${API_BASE}/search/sites`, {
      params: {
        ...(ctx.value.input.siteBy === 'name'
          ? {
              siteName: ctx.value.input.siteName,
            }
          : {
              siteUrl: ctx.value.input.siteUrl,
            }),
      },
    })
    .then(
      ({ data }) => {
        ctx.value.result.siteList = data.body.search
      },
      (err) => {
        console.warn('Failed to search site', err)
      }
    )
    .finally(() => {
      loadingRef.value.site = false
    })
}
function handleSiteSelect(item: any) {
  ctx.value.selected = { ...ctx.value.selected, ...item }
}
function handleSiteRemove() {
  ctx.value.selected.siteUrl = ''
  ctx.value.selected.siteName = ''
  ctx.value.selected.userName = ''
}

function handleUserSearch() {
  loadingRef.value.user = true
  axios
    .get(`${API_BASE}/search/users`, {
      params: {
        userName: ctx.value.input.userName,
        siteUrl: ctx.value.selected.siteUrl,
      },
    })
    .then(
      ({ data }) => {
        ctx.value.result.userList = data.body.search
      },
      (err) => {}
    )
    .finally(() => {
      loadingRef.value.user = false
    })
}
function handleUserSelect(item) {
  ctx.value.selected = item
}
function handleUserRemove() {
  ctx.value.selected.userName = ''
}
</script>

<style scoped lang="sass">
.search-box
  flex-direction: column
  input
    font-size: 1rem
    width: 100%
    padding: 0.4rem 0.6rem
    margin: 1rem auto
    border-radius: 1em
    border: none
    background-color: rgba(0, 0, 0, 0.02)
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1)
    outline: none
    &:hover
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4)
    &:focus
      box-shadow: 0 0 0 2px #0065ff
  .remove-btn
    --color: #a00
    &:hover
      --color: #f00
</style>
